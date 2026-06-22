import { useEffect, useState } from 'react';
import api from '../../api/axios';

const emptyForm = { name: '', address: '' };

export default function BackofficeStores() {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetch = () => api.get('/stores').then(({ data }) => setStores(data));
  useEffect(() => { fetch(); }, []);

  const flash = (text, isError = false) => {
    if (isError) setError(text); else setMsg(text);
    setTimeout(() => { setMsg(''); setError(''); }, 3000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stores', form);
      setForm(emptyForm);
      flash('Magasin créé.');
      fetch();
    } catch (err) {
      flash(err.response?.data?.error || 'Erreur lors de la création.', true);
    }
  };

  const handleEditSave = async (id) => {
    try {
      await api.put(`/stores/${id}`, editForm);
      setEditId(null);
      flash('Magasin mis à jour.');
      fetch();
    } catch (err) {
      flash(err.response?.data?.error || 'Erreur.', true);
    }
  };

  const handleToggle = async (store) => {
    await api.put(`/stores/${store.id}`, { ...store, isActive: !store.isActive });
    fetch();
  };

  const startEdit = (store) => {
    setEditId(store.id);
    setEditForm({ name: store.name, address: store.address });
  };

  return (
    <div>
      <div className="px-8 py-5 bg-white border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">Magasins</h1>
      </div>

      <div className="p-8 max-w-3xl">
        {msg && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4">{msg}</p>}
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">{error}</p>}

        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Nouveau magasin</h2>
          <form onSubmit={handleCreate} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nom du magasin"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Adresse</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Adresse"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex-shrink-0"
            >
              Créer
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-xl border border-gray-200 p-4">
              {editId === store.id ? (
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Adresse</label>
                    <input
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEditSave(store.id)}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{store.name}</p>
                    <p className="text-sm text-gray-500">{store.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${store.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {store.isActive ? 'Actif' : 'Inactif'}
                    </span>
                    <button
                      onClick={() => startEdit(store)}
                      className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleToggle(store)}
                      className={`text-sm border px-3 py-1.5 rounded-lg ${store.isActive ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50'}`}
                    >
                      {store.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {stores.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">Aucun magasin.</p>
          )}
        </div>
      </div>
    </div>
  );
}
