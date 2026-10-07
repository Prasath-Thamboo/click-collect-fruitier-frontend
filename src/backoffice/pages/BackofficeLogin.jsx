import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import AuthDecor from '../../components/ui/AuthDecor';
import Logo from '../../components/ui/Logo';

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
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <AuthDecor />
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo className="w-12 h-12" textClassName="text-2xl" />
          <p className="hud text-mint mt-3">// Espace administration</p>
        </div>

        <div className="relative glass holo rounded-[2rem] p-8 animate-rise">
          <h1 className="text-lg font-semibold text-gray-800 mb-6">Connexion</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="field"
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
                className="field"
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
              className="btn-fruit py-2.5 rounded-lg font-semibold disabled:opacity-50 mt-1"
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
