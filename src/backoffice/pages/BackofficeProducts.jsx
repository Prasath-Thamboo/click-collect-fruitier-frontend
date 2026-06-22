import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const emptyForm = { name: '', description: '', price: '', imageUrl: '', storeId: '' };

export default function BackofficeProducts() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeFilter, setStoreFilter] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchProducts = (sid) => {
    const params = isAdmin && sid ? `?storeId=${sid}` : '';
    api.get(`/products${params}`).then(({ data }) => setProducts(data));
  };

  useEffect(() => {
    fetchProducts(storeFilter);
    if (isAdmin) api.get('/stores').then(({ data }) => setStores(data));
  }, []);

  const flash = (text, isError = false) => {
    if (isError) setError(text); else setMsg(text);
    setTimeout(() => { setMsg(''); setError(''); }, 3000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const storeId = isAdmin ? form.storeId : user?.storeId;
      await api.post('/products', {
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl || undefined,
        storeId,
      });
      setForm(emptyForm);
      setShowAdd(false);
      flash('Produit ajouté.');
      fetchProducts(storeFilter);
    } catch (err) {
      flash(err.response?.data?.error || 'Erreur.', true);
    }
  };

  const handleEditSave = async (id) => {
    try {
      await api.put(`/products/${id}`, {
        name: editForm.name,
        description: editForm.description || undefined,
        price: parseFloat(editForm.price),
        imageUrl: editForm.imageUrl || undefined,
        isAvailable: editForm.isAvailable,
      });
      setEditId(null);
      flash('Produit mis à jour.');
      fetchProducts(storeFilter);
    } catch (err) {
      flash(err.response?.data?.error || 'Erreur.', true);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await api.delete(`/products/${id}`);
      flash('Produit supprimé.');
      fetchProducts(storeFilter);
    } catch (err) {
      flash(err.response?.data?.error || 'Erreur.', true);
    }
  };

  const handleFilterChange = (sid) => {
    setStoreFilter(sid);
    fetchProducts(sid);
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setEditForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      imageUrl: p.imageUrl || '',
      isAvailable: p.isAvailable,
    });
  };

  return (
    <div>
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Produits</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
        >
          + Ajouter un produit
        </button>
      </div>

      <div className="p-8 max-w-4xl">
        {msg && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4">{msg}</p>}
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">{error}</p>}

        {showAdd && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Nouveau produit</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Prix (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">URL image</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://..."
                />
              </div>
              {isAdmin && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Magasin *</label>
                  <select
                    value={form.storeId}
                    onChange={(e) => setForm({ ...form, storeId: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Choisir un magasin</option>
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="col-span-2 flex gap-2 pt-1">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {isAdmin && (
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm text-gray-600">Filtrer par magasin :</label>
            <select
              value={storeFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Tous les magasins</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
              {editId === p.id ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Prix (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <input
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">URL image</label>
                    <input
                      value={editForm.imageUrl}
                      onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id={`avail-${p.id}`}
                      checked={editForm.isAvailable}
                      onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`avail-${p.id}`} className="text-sm text-gray-700">Disponible</label>
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <button
                      onClick={() => handleEditSave(p.id)}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.isAvailable ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                    {p.description && <p className="text-sm text-gray-500 mt-0.5">{p.description}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm font-semibold text-green-600">{Number(p.price).toFixed(2)} €</p>
                      {isAdmin && p.store && (
                        <p className="text-xs text-gray-400">{p.store.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-sm text-red-500 hover:text-red-700 px-3 py-1.5"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">Aucun produit.</p>
          )}
        </div>
      </div>
    </div>
  );
}
