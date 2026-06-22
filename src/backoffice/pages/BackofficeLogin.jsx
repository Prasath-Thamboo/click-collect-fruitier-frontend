import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function BackofficeLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user && ['MANAGER', 'ADMIN'].includes(user.role)) {
    return <Navigate to="/backoffice/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      if (!['MANAGER', 'ADMIN'].includes(data.user.role)) {
        setError('Accès refusé. Seuls les managers et administrateurs peuvent accéder au back office.');
        return;
      }
      login(data.token, data.user);
      navigate('/backoffice/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-white text-2xl font-bold">FruityCollect</p>
          <p className="text-slate-400 text-sm mt-1">Espace administration</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-lg font-semibold text-gray-800 mb-6">Connexion</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="manager@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors mt-1"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Retour au{' '}
          <a href="/" className="text-slate-300 hover:text-white underline">
            site client
          </a>
        </p>
      </div>
    </div>
  );
}
