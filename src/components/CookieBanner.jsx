import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ accepted: false, date: new Date().toISOString() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-gray-600 flex-1">
          Nous utilisons des cookies strictement nécessaires au fonctionnement du service (session, panier).
          Aucun cookie publicitaire ni de tracking n'est utilisé.{' '}
          <Link to="/politique-cookies" className="text-green-600 hover:underline">
            En savoir plus
          </Link>
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={refuse}
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
