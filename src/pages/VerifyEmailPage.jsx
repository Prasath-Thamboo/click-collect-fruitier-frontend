import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthDecor from '../components/ui/AuthDecor';
import Fruit from '../components/fruits/Fruit';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Lien de vérification invalide.');
      return;
    }
    api.get(`/auth/verify-email/${token}`)
      .then(({ data }) => {
        setStatus('success');
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Lien invalide ou expiré.');
      });
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-16">
      <AuthDecor />
      <div className="relative glass holo rounded-[2rem] p-8 sm:p-10 w-full max-w-sm text-center animate-rise">
        {status === 'loading' && (
          <>
            <Fruit kind="lemon" glow className="w-16 h-16 mx-auto mb-4 animate-spin-slow" />
            <p className="hud text-gray-500">Vérification en cours…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <Fruit kind="kiwi" glow className="w-20 h-20 mx-auto mb-5 animate-float" />
            <h1 className="text-3xl font-extrabold text-white mb-3">Email confirmé !</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/login"
              className="btn-fruit px-7 py-3 rounded-2xl"
            >
              Se connecter
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <Fruit kind="cherry" glow className="w-20 h-20 mx-auto mb-5 animate-float" />
            <h1 className="text-3xl font-extrabold text-white mb-3">Lien invalide</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link to="/login" className="text-green-600 hover:underline text-sm">
              Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
