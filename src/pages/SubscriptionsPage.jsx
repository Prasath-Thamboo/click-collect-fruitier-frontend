import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DAY_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const STATUS = {
  ACTIVE: { label: 'Actif', color: 'bg-green-100 text-green-700' },
  PAUSED: { label: 'En pause', color: 'bg-orange-100 text-orange-700' },
  CANCELLED: { label: 'Annulé', color: 'bg-red-100 text-red-700' },
};

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchSubs = () =>
    api.get('/subscriptions').then(({ data }) => { setSubscriptions(data); setLoading(false); });

  useEffect(() => { fetchSubs(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Annuler cet abonnement ? Il ne sera plus renouvelé.')) return;
    setCancelling(id);
    try {
      await api.delete(`/subscriptions/${id}`);
      fetchSubs();
    } catch {
      alert("Erreur lors de l'annulation.");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">Chargement...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-700">Mes abonnements</h1>
        <button
          onClick={() => navigate('/subscriptions/new')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
        >
          + Nouvel abonnement
        </button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔄</p>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Aucun abonnement</h2>
          <p className="text-gray-400 mb-6">Abonnez-vous pour recevoir vos commandes automatiquement chaque semaine avec 15% de réduction.</p>
          <button
            onClick={() => navigate('/subscriptions/new')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700"
          >
            Créer mon premier abonnement
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {subscriptions.map((sub) => {
            const s = STATUS[sub.status] || STATUS.ACTIVE;
            return (
              <div key={sub.id} className="bg-white rounded-2xl shadow border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{sub.store?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub.store?.address}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.color}`}>{s.label}</span>
                </div>

                <div className="flex flex-col gap-1 mb-3">
                  {sub.items.map((item) => (
                    <p key={item.id} className="text-sm text-gray-600">
                      {item.product?.name} × {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {sub.schedules.map((s) => (
                    <span key={s.id} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                      {DAY_LABELS[s.dayOfWeek]} {s.pickupTime}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    <span className="text-lg font-bold text-green-700">{Number(sub.monthlyAmount).toFixed(2)} € / mois</span>
                    <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">-{sub.discountPercent}%</span>
                  </div>
                  {sub.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleCancel(sub.id)}
                      disabled={cancelling === sub.id}
                      className="text-sm text-red-400 hover:text-red-600 disabled:opacity-50"
                    >
                      {cancelling === sub.id ? '...' : 'Annuler'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
