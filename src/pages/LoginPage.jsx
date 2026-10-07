import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import AuthDecor from '../components/ui/AuthDecor';
import Logo from '../components/ui/Logo';
import DemoNotice from '../components/ui/DemoNotice';
import { DEMO_MODE } from '../config/demo';

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
      setResendMessage('Email de vérification renvoyé !');
    } catch {
      setResendMessage('Erreur lors du renvoi.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-16">
      <AuthDecor />
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="relative glass holo rounded-[2rem] p-8 sm:p-10 animate-rise">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl grid place-items-center bg-black/30 border border-white/10 shadow-[0_0_40px_-10px_rgba(255,61,127,.8)]">
              <Logo withText={false} className="w-11 h-11" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-1 text-center">Bon retour !</h1>
          <p className="text-gray-500 text-sm text-center mb-8">Connectez-vous à votre compte</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Adresse email</label>
              <input
                type="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="field"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                <Link to="/forgot-password" className="text-xs text-green-600 hover:text-green-700 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="field"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
                {errorCode === 'EMAIL_NOT_VERIFIED' && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="text-green-600 hover:underline text-sm mt-1 disabled:opacity-50"
                  >
                    {resendLoading ? 'Envoi…' : "Renvoyer l'email de vérification"}
                  </button>
                )}
                {resendMessage && <p className="text-green-600 text-sm mt-1">{resendMessage}</p>}
                {errorCode === 'EMAIL_NOT_VERIFIED' && DEMO_MODE && (
                  <DemoNotice className="mt-3" fruit="lime">
                    Pendant la phase de démonstration, les emails sont envoyés dans une boîte de test et
                n'arrivent pas encore dans votre messagerie.
                  </DemoNotice>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-fruit py-3 rounded-xl font-semibold disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-green-600 font-medium hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
