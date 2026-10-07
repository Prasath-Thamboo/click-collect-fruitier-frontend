import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Fruit from '../components/fruits/Fruit';
import { fruitFor, paletteFor } from '../components/fruits/fruitTheme';
import FruitLoader from '../components/ui/FruitLoader';

function ProductCard({ product, index, isStaff, added, onAdd }) {
  const kind = fruitFor(product.name, product.id);
  const palette = paletteFor(kind);
  const isAdded = added === product.id;

  return (
    <article
      className="group holo glass rounded-[1.75rem] overflow-hidden flex flex-col animate-rise transition-transform duration-500 hover:-translate-y-1.5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Visuel */}
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0 opacity-60 group-hover:opacity-90 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 60%, ${palette.glow}66, transparent 65%), linear-gradient(160deg, ${palette.from}22, transparent)` }}
        />
        <div className="absolute inset-0 grid-floor opacity-30" />
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="relative w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="relative h-full grid place-items-center">
            <Fruit
              kind={kind}
              glow
              className="w-28 h-28 animate-float transition-transform duration-700 group-hover:scale-110"
              style={{ animationDelay: `${-index * 1.3}s` }}
            />
          </div>
        )}
        <span className="absolute top-4 left-4 chip hud text-white/80">
          <span className="neon-dot" style={{ background: palette.glow, boxShadow: `0 0 10px ${palette.glow}` }} />
          {palette.label}
        </span>
        <span className="absolute top-4 right-4 font-display font-bold text-lg px-3 py-1 rounded-xl bg-black/50 backdrop-blur border border-white/10 text-white">
          {product.price.toFixed(2)} <span style={{ color: palette.glow }}>€</span>
        </span>
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-lg text-white leading-snug">{product.name}</h3>
        {product.description && <p className="text-gray-500 text-sm leading-relaxed flex-1">{product.description}</p>}

        {!isStaff && (
          <button
            onClick={() => onAdd(product)}
            className={`mt-auto w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              isAdded ? 'border text-white' : 'btn-fruit'
            }`}
            style={isAdded ? { borderColor: palette.glow, background: `${palette.glow}22`, boxShadow: `0 0 24px -6px ${palette.glow}` } : undefined}
          >
            {isAdded ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Ajouté au panier
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter au panier
              </>
            )}
          </button>
        )}
      </div>
    </article>
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

  if (loading) return <FruitLoader label="Récolte des produits…" />;
  if (!store) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <Fruit kind="cherry" glow className="w-20 h-20 mx-auto mb-5" />
        <p className="text-white font-semibold text-lg">Magasin introuvable.</p>
        <button onClick={() => navigate('/')} className="btn-ghost mt-6 px-6 py-3 rounded-2xl">
          Retour aux magasins
        </button>
      </div>
    );
  }

  const storeKind = fruitFor(store.name, store.id);
  const storePalette = paletteFor(storeKind);
  const cartQty = cart.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 hud text-gray-500 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Tous les magasins
      </button>

      {/* En-tête du magasin */}
      <header className="relative glass rounded-[2rem] p-6 sm:p-10 overflow-hidden mb-12 animate-rise">
        <div
          className="absolute -right-20 -top-24 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{ background: `radial-gradient(circle, ${storePalette.glow}, transparent 70%)` }}
        />
        <div className="absolute inset-0 grid-floor opacity-20" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
          <div className="min-w-0">
            <p className="hud mb-3" style={{ color: storePalette.glow }}>// Magasin connecté</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">{store.name}</h1>
            <p className="text-gray-500 mt-3 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {store.address}
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="chip hud text-gray-600">
                <span className="neon-dot" /> {products.length} produit{products.length > 1 ? 's' : ''}
              </span>
              <span className="chip hud text-gray-600">
                <span className="neon-dot" style={{ background: '#6f6bff', boxShadow: '0 0 10px #6f6bff' }} /> Retrait en magasin
              </span>
            </div>
          </div>
          <Fruit kind={storeKind} glow className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 animate-float self-center" />
        </div>
      </header>

      {/* Produits */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="hud text-mango mb-2">// Catalogue</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Produits disponibles</h2>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="glass rounded-3xl text-center py-20 px-6">
          <Fruit kind="kiwi" glow className="w-20 h-20 mx-auto mb-5 animate-float" />
          <p className="text-white font-semibold text-lg">Aucun produit disponible</p>
          <p className="text-gray-500 text-sm mt-1">La prochaine récolte arrive bientôt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              isStaff={isStaff}
              added={added}
              onAdd={handleAdd}
            />
          ))}
        </div>
      )}

      {/* Bouton panier flottant */}
      {!isStaff && cart.items.length > 0 && cart.storeId === id && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-sm animate-rise">
          <button
            onClick={() => navigate('/cart')}
            className="btn-fruit w-full px-5 py-4 rounded-3xl justify-between"
          >
            <span className="flex items-center gap-2.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Voir le panier
            </span>
            <span className="bg-black/25 rounded-xl px-3 py-1 text-sm font-bold">
              {cartQty} article{cartQty > 1 ? 's' : ''}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
