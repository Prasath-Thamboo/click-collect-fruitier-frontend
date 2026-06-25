import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminPage() {
  const [stores, setStores] = useState([]);
  const [newStore, setNewStore] = useState({ name: '', address: '' });
  const [storeMsg, setStoreMsg] = useState('');

  const [invites, setInvites] = useState([]);
  const [inviteStoreId, setInviteStoreId] = useState('');
  const [inviteMsg, setInviteMsg] = useState('');
  const [newCode, setNewCode] = useState('');

  const fetchStores = () => api.get('/stores').then(({ data }) => setStores(data));
  const fetchInvites = () => api.get('/admin/invites').then(({ data }) => setInvites(data));

  useEffect(() => { fetchStores(); fetchInvites(); }, []);

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setStoreMsg('');
    try {
      await api.post('/stores', newStore);
      setStoreMsg('Magasin cree !');
      setNewStore({ name: '', address: '' });
      fetchStores();
    } catch {
      setStoreMsg('Erreur lors de la creation.');
    }
  };

  const handleToggle = async (store) => {
    await api.put(`/stores/${store.id}`, { ...store, isActive: !store.isActive });
    fetchStores();
  };

  const handleCreateInvite = async (e) => {
    e.preventDefault();
    setInviteMsg('');
    setNewCode('');
    try {
      const { data } = await api.post('/admin/invites', { storeId: inviteStoreId });
      setNewCode(data.code);
      setInviteMsg(`Code genere pour ${data.store.name}`);
      fetchInvites();
    } catch (err) {
      setInviteMsg(err.response?.data?.error || 'Erreur.');
    }
  };

  const handleDeleteInvite = async (id) => {
    await api.delete(`/admin/invites/${id}`);
    fetchInvites();
  };

  const activeInvites = invites.filter((i) => !i.usedAt);
  const usedInvites = invites.filter((i) => i.usedAt);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-green-700">Administration</h1>

      {/* Creer un magasin */}
      <form onSubmit={handleCreateStore} className="bg-white rounded-2xl shadow p-5 border border-gray-100">
        <h2 className="font-semibold text-gray-700 mb-4">Creer un magasin</h2>
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
          {storeMsg && <p className="text-sm text-green-600">{storeMsg}</p>}
          <button type="submit" className="bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
            Creer
          </button>
        </div>
      </form>

      {/* Liste des magasins */}
      <div>
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
                  {store.isActive ? 'Desactiver' : 'Activer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generer un code manager */}
      <form onSubmit={handleCreateInvite} className="bg-white rounded-2xl shadow p-5 border border-gray-100">
        <h2 className="font-semibold text-gray-700 mb-1">Generer un code d'invitation manager</h2>
        <p className="text-gray-400 text-sm mb-4">Le code est a usage unique. Donnez-le au futur manager lors de son inscription.</p>
        <div className="flex flex-col gap-3">
          <select
            value={inviteStoreId}
            onChange={(e) => setInviteStoreId(e.target.value)}
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">-- Selectionner un magasin --</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button type="submit" className="bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
            Generer le code
          </button>
          {newCode && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">{inviteMsg}</p>
              <p className="text-3xl font-mono font-bold text-green-700 tracking-widest">{newCode}</p>
              <p className="text-xs text-gray-400 mt-1">Copiez ce code et donnez-le au futur manager</p>
            </div>
          )}
          {inviteMsg && !newCode && <p className="text-sm text-red-500">{inviteMsg}</p>}
        </div>
      </form>

      {/* Codes actifs */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Codes d'invitation actifs ({activeInvites.length})</h2>
        {activeInvites.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucun code actif.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {activeInvites.map((inv) => (
              <div key={inv.id} className="bg-white rounded-xl shadow p-4 border border-gray-100 flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-green-700 text-lg tracking-widest">{inv.code}</span>
                  <p className="text-gray-500 text-sm">{inv.store.name}</p>
                  <p className="text-gray-400 text-xs">Cree le {new Date(inv.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <button
                  onClick={() => handleDeleteInvite(inv.id)}
                  className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50"
                >
                  Revoquer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Codes utilises */}
      {usedInvites.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-400 mb-4">Codes utilises ({usedInvites.length})</h2>
          <div className="flex flex-col gap-2">
            {usedInvites.map((inv) => (
              <div key={inv.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center opacity-60">
                <div>
                  <span className="font-mono font-bold text-gray-500 text-lg tracking-widest line-through">{inv.code}</span>
                  <p className="text-gray-400 text-sm">{inv.store.name}</p>
                  <p className="text-gray-400 text-xs">Utilise le {new Date(inv.usedAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">Utilise</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
