import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

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
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center">
        {status === 'loading' && (
          <p className="text-gray-500">Vérification en cours...</p>
        )}
        {status === 'success' && (
          <>
            <h1 className="text-2xl font-bold text-green-700 mb-3">Email confirmé !</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/login"
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              Se connecter
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-3">Lien invalide</h1>
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
