import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const STATUS_LABELS = {
  PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  ACCEPTED: { label: 'Acceptée', color: 'bg-blue-100 text-blue-700' },
  READY: { label: 'Prête', color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-700' },
};

export default function ManagerPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState('orders');
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' });
  const [msg, setMsg] = useState('');

  const storeId = user?.storeId;

  const fetchOrders = () => api.get('/orders').then(({ data }) => setOrders(data));
  const fetchProducts = () => storeId && api.get(`/products?storeId=${storeId}`).then(({ data }) => setProducts(data));

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const updateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    fetchOrders();
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/products', { ...newProduct, price: parseFloat(newProduct.price), storeId });
      setMsg('Produit ajouté !');
      setNewProduct({ name: '', description: '', price: '' });
      fetchProducts();
    } catch {
      setMsg('Erreur lors de l\'ajout.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Espace Manager</h1>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 rounded-lg font-medium ${tab === 'orders' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Commandes
        </button>
        <button
          onClick={() => setTab('products')}
          className={`px-4 py-2 rounded-lg font-medium ${tab === 'products' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Produits
        </button>
      </div>

      {tab === 'orders' && (
        <div className="flex flex-col gap-4">
          {orders.length === 0 && <p className="text-gray-400">Aucune commande.</p>}
          {orders.map((order) => {
            const s = STATUS_LABELS[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-600' };
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow p-5 border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{order.user?.email}</p>
                    <p className="text-gray-500 text-sm">
                      Retrait : {new Date(order.pickupDate).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                    </p>
                    <p className="text-green-600 font-bold">{order.totalAmount.toFixed(2)} €</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.color}`}>{s.label}</span>
                </div>
                {order.status !== 'CANCELLED' && (
                  <div className="flex gap-2 flex-wrap">
                    {['ACCEPTED', 'READY', 'CANCELLED'].filter(st => st !== order.status).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateStatus(order.id, st)}
                        className="text-sm border px-3 py-1 rounded-lg hover:bg-gray-50"
                      >
                        → {STATUS_LABELS[st].label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'products' && (
        <div>
          <form onSubmit={handleAddProduct} className="bg-white rounded-2xl shadow p-5 border border-gray-100 mb-6">
            <h2 className="font-semibold text-gray-700 mb-4">Ajouter un produit</h2>
            <div className="flex flex-col gap-3">
              <input
                placeholder="Nom du produit"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                placeholder="Description (optionnel)"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Prix (€)"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {msg && <p className="text-sm text-green-600">{msg}</p>}
              <button type="submit" className="bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
                Ajouter
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-3">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow p-4 border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{p.name}</p>
                  <p className="text-green-600 text-sm">{p.price.toFixed(2)} €</p>
                  {p.description && <p className="text-gray-500 text-sm">{p.description}</p>}
                </div>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
