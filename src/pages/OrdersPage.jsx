import { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUS_LABELS = {
  PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  ACCEPTED: { label: 'Acceptée', color: 'bg-blue-100 text-blue-700' },
  READY: { label: 'Prête', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-700' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Annuler cette commande ?')) return;
    await api.delete(`/orders/${id}`);
    fetchOrders();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Mes commandes</h1>
      {orders.length === 0 ? (
        <p className="text-gray-400">Vous n'avez pas encore de commandes.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const s = STATUS_LABELS[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-600' };
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow p-5 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{order.store?.name}</p>
                    <p className="text-gray-500 text-sm">
                      Retrait : {new Date(order.pickupDate).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.color}`}>{s.label}</span>
                    <p className="text-green-600 font-bold mt-1">{order.totalAmount.toFixed(2)} €</p>
                  </div>
                </div>
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="mt-2 text-sm text-red-500 hover:underline"
                  >
                    Annuler la commande
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
