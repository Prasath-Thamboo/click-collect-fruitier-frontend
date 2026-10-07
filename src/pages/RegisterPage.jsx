import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AuthDecor from '../components/ui/AuthDecor';
import DemoNotice from '../components/ui/DemoNotice';
import { DEMO_MODE } from '../config/demo';
import Logo from '../components/ui/Logo';

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
      <div className="relative min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-16">
      <AuthDecor />
        <div className="w-full max-w-sm">
          <div className="relative glass holo rounded-[2rem] p-8 sm:p-10 animate-rise text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Vérifiez vos emails !</h1>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{success}</p>
            {DEMO_MODE && (
              <DemoNotice className="text-left mb-6" fruit="lime">
                Pendant la phase de démonstration, les emails sont envoyés dans une boîte de test et
                n'arrivent pas encore dans votre messagerie. Contactez l'équipe FruityCollect
                pour faire activer votre compte.
              </DemoNotice>
            )}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-green-600 font-medium hover:underline"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-16">
      <AuthDecor />
      <div className="w-full max-w-sm">
        <div className="relative glass holo rounded-[2rem] p-8 sm:p-10 animate-rise">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl grid place-items-center bg-black/30 border border-white/10 shadow-[0_0_40px_-10px_rgba(255,61,127,.8)]">
              <Logo withText={false} className="w-11 h-11" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-1 text-center">Créer un compte</h1>
          <p className="text-gray-500 text-sm text-center mb-8">Rejoignez FruityCollect</p>

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
              <label className="text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="field"
              />
            </div>

            <div className="border border-gray-100 rounded-xl p-3">
              <button
                type="button"
                onClick={() => { setShowManagerCode(!showManagerCode); setForm({ ...form, managerCode: '' }); }}
                className="w-full text-sm text-gray-500 hover:text-green-700 flex items-center gap-2 transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showManagerCode ? 'rotate-90' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                J'ai un code d'invitation manager
              </button>
              {showManagerCode && (
                <input
                  type="text"
                  placeholder="Code d'invitation (ex: A3F9B2)"
                  value={form.managerCode}
                  onChange={(e) => setForm({ ...form, managerCode: e.target.value.toUpperCase() })}
                  className="field mt-3 font-mono tracking-widest uppercase"
                  maxLength={12}
                />
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-fruit py-3 rounded-xl font-semibold disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Création du compte…' : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-green-600 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
