import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorCode('');
    setResendMessage('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion.');
      setErrorCode(err.response?.data?.code || '');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage('');
    try {
      await api.post('/auth/resend-verification', { email: form.email });
      setResendMessage('Email de verification renvoye !');
    } catch {
      setResendMessage('Erreur lors du renvoi.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">Connexion</h1>
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
          {error && (
            <div>
              <p className="text-red-500 text-sm">{error}</p>
              {errorCode === 'EMAIL_NOT_VERIFIED' && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-green-600 hover:underline text-sm mt-1 disabled:opacity-50"
                >
                  {resendLoading ? 'Envoi...' : "Renvoyer l'email de verification"}
                </button>
              )}
              {resendMessage && <p className="text-green-600 text-sm mt-1">{resendMessage}</p>}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <div className="flex flex-col items-center gap-1 mt-4">
          <p className="text-sm text-gray-500">
            Pas de compte ?{' '}
            <Link to="/register" className="text-green-600 hover:underline">S'inscrire</Link>
          </p>
          <Link to="/forgot-password" className="text-sm text-gray-400 hover:underline">
            Mot de passe oublie ?
          </Link>
        </div>
      </div>
    </div>
  );
}
