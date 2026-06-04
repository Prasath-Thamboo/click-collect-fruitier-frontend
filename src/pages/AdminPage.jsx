import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminPage() {
  const [stores, setStores] = useState([]);
  const [newStore, setNewStore] = useState({ name: '', address: '' });
  const [msg, setMsg] = useState('');

  const fetchStores = () => api.get('/stores').then(({ data }) => setStores(data));
  useEffect(() => { fetchStores(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/stores', newStore);
      setMsg('Magasin créé !');
      setNewStore({ name: '', address: '' });
      fetchStores();
    } catch {
      setMsg('Erreur lors de la création.');
    }
  };

  const handleToggle = async (store) => {
    await api.put(`/stores/${store.id}`, { ...store, isActive: !store.isActive });
    fetchStores();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Administration</h1>

      <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow p-5 border border-gray-100 mb-8">
        <h2 className="font-semibold text-gray-700 mb-4">Créer un magasin</h2>
        <div className="flex flex-col gap-3">
          <input
            placeholder="Nom du magasin"
            value={newStore.name}
            onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            placeholder="Adresse"
            value={newStore.address}
            onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {msg && <p className="text-sm text-green-600">{msg}</p>}
          <button type="submit" className="bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
            Créer
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">Tous les magasins</h2>
      <div className="flex flex-col gap-3">
        {stores.map((store) => (
          <div key={store.id} className="bg-white rounded-xl shadow p-4 border border-gray-100 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">{store.name}</p>
              <p className="text-gray-500 text-sm">📍 {store.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${store.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {store.isActive ? 'Actif' : 'Inactif'}
              </span>
              <button
                onClick={() => handleToggle(store)}
                className="text-sm border px-3 py-1 rounded-lg hover:bg-gray-50"
              >
                {store.isActive ? 'Désactiver' : 'Activer'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
