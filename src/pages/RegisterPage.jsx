import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', managerCode: '' });
  const [showManagerCode, setShowManagerCode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = { email: form.email, password: form.password };
      if (showManagerCode && form.managerCode.trim()) {
        payload.managerCode = form.managerCode.trim();
      }
      const { data } = await api.post('/auth/register', payload);
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-green-700 mb-3">Inscription reussie !</h1>
          <p className="text-gray-600 mb-6">{success}</p>
          <Link to="/login" className="text-green-600 hover:underline text-sm">
            Retour a la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">Creer un compte</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <div className="border-t pt-3">
            <button
              type="button"
              onClick={() => { setShowManagerCode(!showManagerCode); setForm({ ...form, managerCode: '' }); }}
              className="text-sm text-gray-500 hover:text-green-700 flex items-center gap-1"
            >
              <span>{showManagerCode ? '▾' : '▸'}</span>
              J'ai un code d'invitation manager
            </button>
            {showManagerCode && (
              <input
                type="text"
                placeholder="Code d'invitation (ex: A3F9B2)"
                value={form.managerCode}
                onChange={(e) => setForm({ ...form, managerCode: e.target.value.toUpperCase() })}
                className="mt-2 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 font-mono tracking-widest uppercase"
                maxLength={12}
              />
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Deja un compte ?{' '}
          <Link to="/login" className="text-green-600 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
