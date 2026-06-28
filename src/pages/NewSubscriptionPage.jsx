import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import api from '../api/axios';
import StripePaymentForm from '../components/StripePaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const DAY_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export default function NewSubscriptionPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 — store
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  // Step 2 — products
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState({}); // { productId: quantity }

  // Step 3 — schedule
  const [selectedDays, setSelectedDays] = useState([]);
  const [pickupTime, setPickupTime] = useState('10:00');

  // Step 4 — payment
  const [intentData, setIntentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/stores').then(({ data }) => setStores(data.filter((s) => s.isActive)));
  }, []);

  useEffect(() => {
    if (selectedStore) {
      api.get(`/products?storeId=${selectedStore.id}`).then(({ data }) => setProducts(data));
    }
  }, [selectedStore]);

  const itemList = Object.entries(items)
    .filter(([, qty]) => qty > 0)
    .map(([productId, quantity]) => ({ productId, quantity }));

  const schedules = selectedDays.map((d) => ({ dayOfWeek: d, pickupTime }));

  const orderTotal = itemList.reduce((sum, item) => {
    const p = products.find((p) => p.id === item.productId);
    return sum + (p?.price || 0) * item.quantity;
  }, 0);

  const pickupsPerMonth = Math.round(schedules.length * 4.33);
  const monthlyBase = orderTotal * pickupsPerMonth;
  const monthlyDiscounted = monthlyBase * 0.85;

  const handleGoToPayment = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/subscriptions/create-intent', {
        storeId: selectedStore.id,
        items: itemList,
        schedules,
      });
      setIntentData(data);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création du paiement.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (stripeSubscriptionId) => {
    await api.post('/subscriptions/confirm', {
      stripeSubscriptionId,
      storeId: selectedStore.id,
      items: itemList,
      schedules,
    });
    navigate('/subscriptions');
  };

  const steps = ['Boutique', 'Produits', 'Planning', 'Paiement'];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/subscriptions')} className="text-gray-400 hover:text-gray-600 text-sm mb-4">
        ← Retour
      </button>
      <h1 className="text-2xl font-bold text-green-700 mb-6">Nouvel abonnement</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? 'bg-green-600 text-white' : step === i + 1 ? 'bg-green-600 text-white ring-2 ring-green-200' : 'bg-gray-200 text-gray-500'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm ${step === i + 1 ? 'text-green-700 font-medium' : 'text-gray-400'}`}>{label}</span>
            {i < steps.length - 1 && <span className="text-gray-300 mx-1">→</span>}
          </div>
        ))}
      </div>

      {/* Step 1 — Boutique */}
      {step === 1 && (
        <div className="flex flex-col gap-3">
          <p className="text-gray-600 mb-2">Choisissez la boutique pour votre abonnement.</p>
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${selectedStore?.id === store.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
            >
              <p className="font-semibold text-gray-800">{store.name}</p>
              <p className="text-sm text-gray-500">{store.address}</p>
            </button>
          ))}
          <button
            disabled={!selectedStore}
            onClick={() => setStep(2)}
            className="mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            Suivant →
          </button>
        </div>
      )}

      {/* Step 2 — Produits */}
      {step === 2 && (
        <div className="flex flex-col gap-3">
          <p className="text-gray-600 mb-2">Choisissez les produits de votre panier récurrent.</p>
          {products.filter((p) => p.isAvailable).map((product) => {
            const qty = items[product.id] || 0;
            return (
              <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{product.name}</p>
                  {product.description && <p className="text-gray-400 text-sm">{product.description}</p>}
                  <p className="text-green-600 text-sm font-medium">{product.price.toFixed(2)} € / unité</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setItems((prev) => ({ ...prev, [product.id]: Math.max(0, (prev[product.id] || 0) - 1) }))}
                    className="w-7 h-7 rounded-full border text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                  >−</button>
                  <span className="w-6 text-center font-semibold">{qty}</span>
                  <button
                    onClick={() => setItems((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }))}
                    className="w-7 h-7 rounded-full border text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                  >+</button>
                </div>
              </div>
            );
          })}
          {itemList.length > 0 && (
            <p className="text-sm text-green-700 font-medium">
              Total par passage : {orderTotal.toFixed(2)} €
            </p>
          )}
          <div className="flex gap-3 mt-4">
            <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50">← Retour</button>
            <button
              disabled={itemList.length === 0}
              onClick={() => setStep(3)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Planning */}
      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-gray-600 font-medium mb-3">Jours de retrait dans la semaine</p>
            <div className="flex gap-2 flex-wrap">
              {DAY_LABELS.map((label, day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDays((prev) =>
                    prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                  )}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${selectedDays.includes(day) ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-600 font-medium block mb-2">Heure de retrait</label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {selectedDays.length > 0 && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm font-semibold text-green-800 mb-1">Récapitulatif abonnement</p>
              <p className="text-sm text-green-700">
                {selectedDays.map((d) => DAY_LABELS[d]).join(', ')} à {pickupTime} — {pickupsPerMonth} passages/mois
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Base : {monthlyBase.toFixed(2)} €/mois
              </p>
              <p className="text-base font-bold text-green-700 mt-1">
                Après réduction 15% : {monthlyDiscounted.toFixed(2)} €/mois
              </p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button onClick={() => setStep(2)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50">← Retour</button>
            <button
              disabled={selectedDays.length === 0 || loading}
              onClick={handleGoToPayment}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : 'Passer au paiement →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4 — Paiement */}
      {step === 4 && intentData && (
        <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 font-semibold">Abonnement mensuel — {intentData.discountPercent}% de réduction</p>
            <p className="text-xl font-bold text-green-700 mt-1">{intentData.monthlyAmount.toFixed(2)} € / mois</p>
            <p className="text-xs text-gray-400 mt-0.5">Renouvellement automatique — annulable à tout moment</p>
          </div>
          <Elements stripe={stripePromise} options={{ clientSecret: intentData.clientSecret, locale: 'fr' }}>
            <StripePaymentForm
              onSuccess={(paymentIntentId) => handlePaymentSuccess(intentData.stripeSubscriptionId)}
              total={intentData.monthlyAmount}
            />
          </Elements>
          <button onClick={() => setStep(3)} className="w-full text-gray-400 hover:text-gray-600 text-sm text-center mt-3">
            ← Modifier le planning
          </button>
        </div>
      )}
    </div>
  );
}
