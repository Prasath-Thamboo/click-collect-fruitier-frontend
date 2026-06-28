import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StripePaymentForm from '../components/StripePaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      <div className={`flex items-center gap-2 ${step === 'form' ? 'text-green-700' : 'text-gray-400'}`}>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
          step === 'form' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>1</span>
        <span className={`text-sm font-medium ${step === 'form' ? 'text-gray-900' : 'text-gray-400'}`}>
          Récapitulatif
        </span>
      </div>
      <div className="flex-1 h-px bg-gray-200 mx-1" />
      <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-green-700' : 'text-gray-400'}`}>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
          step === 'payment' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>2</span>
        <span className={`text-sm font-medium ${step === 'payment' ? 'text-gray-900' : 'text-gray-400'}`}>
          Paiement
        </span>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
    return <Navigate to="/" replace />;
  }

  const [step, setStep] = useState('form');
  const [pickupDate, setPickupDate] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoToPayment = async (e) => {
    e.preventDefault();
    if (!pickupDate) return setError('Choisissez une date de retrait.');
    setError('');
    setLoading(true);
    try {
      const payload = {
        storeId: cart.storeId,
        pickupDate,
        items: cart.items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      };
      if (!user) {
        payload.guestEmail = guestEmail;
        payload.guestPhone = guestPhone;
      }
      const { data } = await api.post('/payments/create-intent', payload);
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setStep('payment');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création du paiement.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (intentId) => {
    await api.post('/orders', {
      storeId: cart.storeId,
      pickupDate,
      items: cart.items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      paymentIntentId: intentId,
      ...(user ? {} : { guestEmail, guestPhone }),
    });
    clearCart();
    if (user) {
      navigate('/orders');
    } else {
      setStep('confirmed');
    }
  };

  if (step === 'confirmed') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
        <p className="text-gray-500 mb-1">Un email de confirmation a été envoyé à</p>
        <p className="font-semibold text-gray-800 mb-2">{guestEmail}</p>
        <p className="text-gray-400 text-sm mb-8">Votre commande sera prête au retrait à la date choisie.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
        <p className="text-gray-400 mb-8">Ajoutez des produits depuis un magasin.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          Voir les magasins
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Mon panier</h1>
      {cart.storeName && (
        <p className="text-gray-500 text-sm mb-6 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {cart.storeName}
        </p>
      )}

      <StepIndicator step={step} />

      {/* Cart items */}
      <div className="flex flex-col gap-3 mb-6">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{item.name}</p>
              {item.description && (
                <p className="text-gray-400 text-xs mt-0.5 truncate">{item.description}</p>
              )}
              <p className="text-green-600 font-medium text-sm mt-1">
                {item.price.toFixed(2)} € / unité
              </p>
            </div>

            {step === 'form' && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-medium transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-gray-900 text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-medium transition-colors"
                >
                  +
                </button>
              </div>
            )}

            <div className="text-right min-w-14">
              <p className="font-bold text-gray-900 text-sm">
                {(item.price * item.quantity).toFixed(2)} €
              </p>
              {step === 'form' && (
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-600 text-xs mt-1 transition-colors"
                >
                  Retirer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary + form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-50">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-2xl font-extrabold text-green-700">{total.toFixed(2)} €</span>
        </div>

        {step === 'form' && (
          <form onSubmit={handleGoToPayment} className="flex flex-col gap-4">
            {!user && (
              <div className="flex flex-col gap-3 pb-4 mb-1 border-b border-gray-100">
                <p className="text-sm text-gray-500 font-medium">Commander sans compte</p>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">Adresse email</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">Numéro de téléphone</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="06 00 00 00 00"
                    required
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Vous avez un compte ?{' '}
                  <button type="button" onClick={() => navigate('/login')} className="text-green-600 hover:underline">
                    Se connecter
                  </button>
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Date et heure de retrait</label>
              <input
                type="datetime-local"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-3.5 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Chargement…' : (
                <>
                  Passer au paiement
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={clearCart}
              className="text-gray-400 hover:text-gray-600 text-sm text-center transition-colors"
            >
              Vider le panier
            </button>
          </form>
        )}

        {step === 'payment' && clientSecret && (
          <div className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            <Elements stripe={stripePromise} options={{ clientSecret, locale: 'fr' }}>
              <StripePaymentForm onSuccess={handlePaymentSuccess} total={total} />
            </Elements>
            <button
              type="button"
              onClick={() => { setStep('form'); setError(''); }}
              className="text-gray-400 hover:text-gray-600 text-sm text-center transition-colors flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Modifier ma commande
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
