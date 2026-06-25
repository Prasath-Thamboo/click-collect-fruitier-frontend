import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
    return <Navigate to="/" replace />;
  }
  const [pickupDate, setPickupDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!pickupDate) return setError('Choisissez une date de retrait.');
    setError('');
    setLoading(true);
    try {
      await api.post('/orders', {
        storeId: cart.storeId,
        pickupDate,
        items: cart.items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      clearCart();
      navigate('/orders');
    } catch {
      setError('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Votre panier est vide</h1>
        <p className="text-gray-400 mb-6">Ajoutez des produits depuis un magasin.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700"
        >
          Voir les magasins
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-1">Mon panier</h1>
      {cart.storeName && (
        <p className="text-gray-500 mb-6 text-sm">📍 {cart.storeName}</p>
      )}

      <div className="flex flex-col gap-3 mb-6">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow p-4 border border-gray-100 flex items-center gap-4"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{item.name}</p>
              {item.description && (
                <p className="text-gray-400 text-sm">{item.description}</p>
              )}
              <p className="text-green-600 font-medium text-sm mt-1">
                {item.price.toFixed(2)} € / unité
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-7 h-7 rounded-full border text-gray-600 hover:bg-gray-100 flex items-center justify-center text-lg leading-none"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 rounded-full border text-gray-600 hover:bg-gray-100 flex items-center justify-center text-lg leading-none"
              >
                +
              </button>
            </div>

            <div className="text-right min-w-16">
              <p className="font-bold text-gray-800">
                {(item.price * item.quantity).toFixed(2)} €
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-400 hover:text-red-600 text-xs mt-1"
              >
                Retirer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-2xl font-bold text-green-700">{total.toFixed(2)} €</span>
        </div>

        <form onSubmit={handleCheckout} className="flex flex-col gap-3">
          <label className="text-sm text-gray-600 font-medium">Date et heure de retrait</label>
          <input
            type="datetime-local"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Commande en cours...' : 'Valider la commande'}
          </button>
          <button
            type="button"
            onClick={clearCart}
            className="text-gray-400 hover:text-gray-600 text-sm text-center"
          >
            Vider le panier
          </button>
        </form>
      </div>
    </div>
  );
}
