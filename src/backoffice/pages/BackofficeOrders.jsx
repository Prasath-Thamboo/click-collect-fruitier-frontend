import { useEffect, useState } from 'react';
import api from '../../api/axios';

const STATUS_LABELS = {
  PENDING: { label: 'En attente', color: 'bg-orange-100 text-orange-700' },
  ACCEPTED: { label: 'Acceptée', color: 'bg-blue-100 text-blue-700' },
  READY: { label: 'Prête', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-700' },
};

const STATUS_ORDER = ['PENDING', 'ACCEPTED', 'READY', 'CANCELLED'];

export default function BackofficeOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = () => api.get('/orders').then(({ data }) => setOrders(data));
  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    fetchOrders();
  };

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div>
      <div className="px-8 py-5 bg-white border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">Commandes</h1>
      </div>

      <div className="p-8 max-w-4xl">
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => setFilter('')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === '' ? 'bg-slate-800 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            Toutes ({orders.length})
          </button>
          {STATUS_ORDER.map((s) => {
            const count = orders.filter((o) => o.status === s).length;
            const { label, color } = STATUS_LABELS[s];
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-slate-800 text-white' : `${color} hover:opacity-80`}`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {filtered.map((order) => {
            const s = STATUS_LABELS[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-600' };
            const isExpanded = expanded === order.id;

            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-800">{order.user?.email}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>
                          {s.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Retrait : {new Date(order.pickupDate).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                      </p>
                      {order.store && (
                        <p className="text-xs text-gray-400 mt-0.5">{order.store.name}</p>
                      )}
                      <p className="text-base font-bold text-green-600 mt-1">
                        {Number(order.totalAmount).toFixed(2)} €
                      </p>
                    </div>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : order.id)}
                      className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-1 rounded"
                    >
                      {isExpanded ? 'Masquer' : `Voir détails (${order.items?.length || 0})`}
                    </button>
                  </div>

                  {isExpanded && order.items && (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <div className="space-y-1.5">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.product?.name} × {item.quantity}
                            </span>
                            <span className="text-gray-500">
                              {(item.unitPrice * item.quantity).toFixed(2)} €
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {order.status !== 'CANCELLED' && (
                    <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                      {STATUS_ORDER.filter((st) => st !== order.status && st !== 'PENDING').map((st) => (
                        <button
                          key={st}
                          onClick={() => updateStatus(order.id, st)}
                          className={`text-xs border px-3 py-1.5 rounded-lg font-medium transition-colors ${STATUS_LABELS[st].color} border-current`}
                        >
                          → {STATUS_LABELS[st].label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">Aucune commande.</p>
          )}
        </div>
      </div>
    </div>
  );
}
