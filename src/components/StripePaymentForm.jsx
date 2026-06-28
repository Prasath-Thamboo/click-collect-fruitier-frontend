import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function StripePaymentForm({ onSuccess, total }) {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !ready) return;
    setLoading(true);
    setError('');

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message || 'Erreur lors du paiement.');
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      await onSuccess(paymentIntent.id);
    } else {
      setError("Le paiement n'a pas pu être validé. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="text-sm text-gray-500 mb-1">
        Montant à payer : <span className="font-bold text-green-700">{total.toFixed(2)} €</span>
      </div>
      <PaymentElement onReady={() => setReady(true)} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || !ready || loading}
        className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
      >
        {!ready ? 'Chargement...' : loading ? 'Paiement en cours...' : `Payer ${total.toFixed(2)} €`}
      </button>
    </form>
  );
}
