import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StripePaymentForm from '../components/StripePaymentForm';
import Fruit from '../components/fruits/Fruit';
import { fruitFor, paletteFor } from '../components/fruits/fruitTheme';
import { stripeAppearance } from '../components/stripeAppearance';
import DemoNotice from '../components/ui/DemoNotice';
import { DEMO_MODE } from '../config/demo';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function StepIndicator({ step }) {
  const steps = [
    { id: 'form', label: 'Récapitulatif' },
    { id: 'payment', label: 'Paiement' },
  ];
  const current = steps.findIndex((s) => s.id === step);
  return (
    <div className="flex items-center gap-3 mb-8">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-3 flex-1 last:flex-none">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-9 h-9 rounded-xl grid place-items-center font-mono text-xs font-bold transition-all ${
                i <= current
                  ? 'bg-gradient-to-br from-strawberry to-mango text-white shadow-[0_0_20px_-4px_rgba(255,61,127,.9)]'
                  : 'bg-white/5 border border-white/10 text-gray-400'
              }`}
            >
              {i < current ? '✓' : `0${i + 1}`}
            </span>
            <span className={`hud ${i <= current ? 'text-white' : 'text-gray-400'}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-strawberry to-mango transition-all duration-700"
                style={{ width: current > i ? '100%' : '0%' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ErrorBox({ children }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{children}</div>
  );
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('form');
  const [pickupDate, setPickupDate] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoBlocked, setDemoBlocked] = useState(false);

  if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
    return <Navigate to="/" replace />;
  }

  const handleGoToPayment = async (e) => {
    e.preventDefault();
    if (!pickupDate) return setError('Choisissez une date de retrait.');
    setError('');
    if (DEMO_MODE) {
      setDemoBlocked(true);
      return;
    }
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
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-rise">
        <div className="relative w-40 h-40 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-kiwi/20 blur-2xl" />
          <div className="absolute inset-0 rounded-full border border-kiwi/40 animate-spin-slow border-dashed" />
          <Fruit kind="kiwi" glow className="relative w-full h-full p-6 animate-float" />
        </div>
        <p className="hud text-kiwi mb-2">// Commande validée</p>
        <h1 className="text-4xl font-extrabold text-white mb-3">C’est dans la boîte !</h1>
        <p className="text-gray-500">Un email de confirmation a été envoyé à</p>
        <p className="font-semibold text-white mt-1 mb-2">{guestEmail}</p>
        <p className="text-gray-400 text-sm mb-8">Votre commande sera prête au retrait à la date choisie.</p>
        <button onClick={() => navigate('/')} className="btn-fruit px-8 py-4 rounded-2xl">
          Retour à l’accueil
        </button>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center animate-rise">
        <div className="relative w-36 h-36 mx-auto mb-8 grid place-items-center">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-4 rounded-full border border-dashed border-white/10 animate-spin-slow" />
          <Fruit kind="lemon" glow className="w-20 h-20 animate-float" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">Ajoutez des fruits depuis un magasin pour commencer.</p>
        <button onClick={() => navigate('/')} className="btn-fruit px-8 py-4 rounded-2xl">
          Voir les magasins
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <p className="hud text-mango mb-2">// Panier</p>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Mon panier</h1>
      {cart.storeName && (
        <p className="text-gray-500 mt-2 mb-8 flex items-center gap-2">
          <span className="neon-dot" /> Retrait chez <span className="text-white font-medium">{cart.storeName}</span>
        </p>
      )}

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        {/* Articles */}
        <div className="flex flex-col gap-3">
          {cart.items.map((item, i) => {
            const kind = fruitFor(item.name, item.id);
            const palette = paletteFor(kind);
            return (
              <div
                key={item.id}
                className="glass rounded-3xl p-4 flex items-center gap-4 animate-rise"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className="relative w-16 h-16 rounded-2xl grid place-items-center shrink-0 border border-white/10"
                  style={{ background: `radial-gradient(circle, ${palette.glow}44, transparent 70%)` }}
                >
                  <Fruit kind={kind} className="w-11 h-11" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{item.name}</p>
                  {item.description && <p className="text-gray-400 text-xs mt-0.5 truncate">{item.description}</p>}
                  <p className="hud mt-1.5" style={{ color: palette.glow }}>
                    {item.price.toFixed(2)} € / unité
                  </p>
                </div>

                {step === 'form' && (
                  <div className="flex items-center gap-1 rounded-2xl bg-black/30 border border-white/10 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-xl hover:bg-white/10 text-gray-600 grid place-items-center font-bold transition-colors"
                      aria-label="Diminuer"
                    >
                      −
                    </button>
                    <span className="w-7 text-center font-mono font-semibold text-white text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-xl hover:bg-white/10 text-gray-600 grid place-items-center font-bold transition-colors"
                      aria-label="Augmenter"
                    >
                      +
                    </button>
                  </div>
                )}

                <div className="text-right min-w-16">
                  <p className="font-display font-bold text-white">{(item.price * item.quantity).toFixed(2)} €</p>
                  {step === 'form' && (
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-strawberry text-xs mt-1 transition-colors"
                    >
                      Retirer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Récapitulatif + formulaire */}
        <div className="holo glass rounded-[2rem] p-6 sm:p-7 lg:sticky lg:top-28">
          <StepIndicator step={step} />

          <div className="flex justify-between items-end mb-6 pb-6 border-b border-white/10">
            <span className="hud text-gray-400">Total</span>
            <span className="font-display text-4xl font-extrabold text-fruit">{total.toFixed(2)} €</span>
          </div>

          {step === 'form' && (
            <form onSubmit={handleGoToPayment} className="flex flex-col gap-4">
              {!user && (
                <div className="flex flex-col gap-3 pb-5 mb-1 border-b border-white/10">
                  <p className="hud text-gray-500">Commander sans compte</p>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-gray-600">Adresse email</span>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="field"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-gray-600">Numéro de téléphone</span>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="06 00 00 00 00"
                      required
                      className="field"
                    />
                  </label>
                  <p className="text-xs text-gray-400">
                    Vous avez un compte ?{' '}
                    <button type="button" onClick={() => navigate('/login')} className="text-mint hover:underline">
                      Se connecter
                    </button>
                  </p>
                </div>
              )}

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Date et heure de retrait</span>
                <input
                  type="datetime-local"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                  className="field"
                />
              </label>

              {error && <ErrorBox>{error}</ErrorBox>}

              {demoBlocked && (
                <DemoNotice title="Le paiement en ligne arrive bientôt">
                  FruityCollect est encore en phase de démonstration : aucun paiement n'est encaissé pour le
                  moment. Votre panier est conservé, vous pourrez finaliser votre commande dès l'ouverture
                  du service.
                </DemoNotice>
              )}

              <button type="submit" disabled={loading} className="btn-fruit py-4 rounded-2xl mt-1">
                {loading ? 'Chargement…' : (
                  <>
                    Passer au paiement
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="text-gray-400 hover:text-strawberry text-sm text-center transition-colors"
              >
                Vider le panier
              </button>
            </form>
          )}

          {step === 'payment' && clientSecret && (
            <div className="flex flex-col gap-4">
              {error && <ErrorBox>{error}</ErrorBox>}
              <Elements stripe={stripePromise} options={{ clientSecret, locale: 'fr', appearance: stripeAppearance }}>
                <StripePaymentForm onSuccess={handlePaymentSuccess} total={total} />
              </Elements>
              <button
                type="button"
                onClick={() => { setStep('form'); setError(''); }}
                className="text-gray-400 hover:text-white text-sm text-center transition-colors flex items-center justify-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Modifier ma commande
              </button>
            </div>
          )}

          <p className="hud text-gray-400 text-center mt-6 flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Paiement sécurisé Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
