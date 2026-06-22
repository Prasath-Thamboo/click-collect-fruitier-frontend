import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ROLE_LABELS = {
  ADMIN: { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
  MANAGER: { label: 'Manager', color: 'bg-blue-100 text-blue-700' },
  CLIENT: { label: 'Client', color: 'bg-gray-100 text-gray-600' },
  GUEST: { label: 'Guest', color: 'bg-gray-100 text-gray-400' },
};

const emptyForm = { email: '', password: '', role: 'MANAGER', storeId: '' };

export default function BackofficeUsers() {
  const { user: currentUser } = useAuth();
  if (currentUser?.role !== 'ADMIN') return <Navigate to="/backoffice/dashboard" replace />;

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ role: '', storeId: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = () => api.get('/users').then(({ data }) => setUsers(data));
  const fetchStores = () => api.get('/stores').then(({ data }) => setStores(data));

  useEffect(() => { fetchUsers(); fetchStores(); }, []);

  const flash = (text, isError = false) => {
    if (isError) setError(text); else setMsg(text);
    setTimeout(() => { setMsg(''); setError(''); }, 4000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', {
        email: form.email,
        password: form.password,
        role: form.role,
        storeId: form.role === 'MANAGER' ? form.storeId || undefined : undefined,
      });
      setForm(emptyForm);
      setShowAdd(false);
      flash('Utilisateur créé.');
      fetchUsers();
    } catch (err) {
      flash(err.response?.data?.error || 'Erreur lors de la création.', true);
    }
  };

  const handleEditSave = async (id) => {
    try {
      await api.put(`/users/${id}`, {
        role: editForm.role,
        storeId: editForm.role === 'MANAGER' ? editForm.storeId || undefined : undefined,
      });
      setEditId(null);
      flash('Utilisateur mis à jour.');
      fetchUsers();
    } catch (err) {
      flash(err.response?.data?.error || 'Erreur.', true);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/users/${id}`);
      flash('Utilisateur supprimé.');
      fetchUsers();
    } catch (err) {
      flash(err.response?.data?.error || 'Erreur.', true);
    }
  };

  const startEdit = (u) => {
    setEditId(u.id);
    setEditForm({ role: u.role, storeId: u.managedStoreId || '' });
  };

  return (
    <div>
      <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Utilisateurs</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
        >
          + Créer un utilisateur
        </button>
      </div>

      <div className="p-8 max-w-4xl">
        {msg && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4">{msg}</p>}
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">{error}</p>}

        {showAdd && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Nouvel utilisateur</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mot de passe *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rôle *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value, storeId: '' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Administrateur</option>
                  <option value="CLIENT">Client</option>
                </select>
              </div>
              {form.role === 'MANAGER' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Magasin assigné</label>
                  <select
                    value={form.storeId}
                    onChange={(e) => setForm({ ...form, storeId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Aucun magasin</option>
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
                  Créer
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

        <div className="space-y-3">
          {users.map((u) => {
            const roleInfo = ROLE_LABELS[u.role] || ROLE_LABELS.CLIENT;
            return (
              <div key={u.id} className="bg-white rounded-xl border border-gray-200 p-4">
                {editId === u.id ? (
                  <div className="flex items-end gap-3">
                    <div>
                      <p className="font-medium text-gray-800 mb-2">{u.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rôle</label>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value, storeId: '' })}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Administrateur</option>
                        <option value="CLIENT">Client</option>
                      </select>
                    </div>
                    {editForm.role === 'MANAGER' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Magasin</label>
                        <select
                          value={editForm.storeId}
                          onChange={(e) => setEditForm({ ...editForm, storeId: e.target.value })}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Aucun</option>
                          {stores.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSave(u.id)}
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
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800">{u.email}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                        {u.id === currentUser?.id && (
                          <span className="text-xs text-gray-400">(vous)</span>
                        )}
                      </div>
                      {u.managedStore && (
                        <p className="text-xs text-gray-500 mt-0.5">Magasin : {u.managedStore.name}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        Créé le {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {u.id !== currentUser?.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(u)}
                          className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="text-sm text-red-500 hover:text-red-700 px-3 py-1.5"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {users.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">Aucun utilisateur.</p>
          )}
        </div>
      </div>
    </div>
  );
}
