import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AuthDecor from '../components/ui/AuthDecor';
import DemoNotice from '../components/ui/DemoNotice';
import { DEMO_MODE } from '../config/demo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-16">
      <AuthDecor />
      <div className="w-full max-w-sm">
        <div className="relative glass holo rounded-[2rem] p-8 sm:p-10 animate-rise">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-1 text-center">Mot de passe oublié</h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            Entrez votre email et nous vous enverrons un lien de réinitialisation.
          </p>

          {DEMO_MODE && (
            <DemoNotice className="mb-6" fruit="lime">
              Pendant la phase de démonstration, les emails sont envoyés dans une boîte de test et
                n'arrivent pas encore dans votre messagerie. Contactez l'équipe FruityCollect pour
              réinitialiser votre mot de passe.
            </DemoNotice>
          )}

          {message ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-4 mb-6">
                <p className="text-green-700 font-medium text-sm">{message}</p>
              </div>
              <Link to="/login" className="text-sm text-green-600 font-medium hover:underline">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Adresse email</label>
                <input
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="field"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-fruit py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {loading ? 'Envoi…' : 'Envoyer le lien'}
              </button>

              <Link to="/login" className="text-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
                Retour à la connexion
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
