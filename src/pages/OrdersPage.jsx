import { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUS = {
  PENDING:   { label: 'En attente',  color: 'bg-amber-50 text-amber-700 border border-amber-200' },
  ACCEPTED:  { label: 'Acceptée',    color: 'bg-blue-50 text-blue-700 border border-blue-200' },
  READY:     { label: 'Prête',       color: 'bg-green-50 text-green-700 border border-green-200' },
  CANCELLED: { label: 'Annulée',     color: 'bg-gray-50 text-gray-500 border border-gray-200' },
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-gray-400">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Mes commandes</h1>
      <p className="text-gray-500 text-sm mb-8">Suivez l'état de vos commandes</p>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Aucune commande pour le moment</p>
          <p className="text-gray-400 text-sm mt-1">Vos commandes apparaîtront ici</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const s = STATUS[order.status] || { label: order.status, color: 'bg-gray-50 text-gray-500 border border-gray-200' };
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{order.store?.name}</p>
                    <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Retrait le {new Date(order.pickupDate).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${s.color}`}>
                      {s.label}
                    </span>
                    <p className="text-green-600 font-bold text-sm">{order.totalAmount.toFixed(2)} €</p>
                  </div>
                </div>

                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
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
