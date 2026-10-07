import { useState } from 'react';
import { Link } from 'react-router-dom';
import Fruit from './fruits/Fruit';

function hasConsent() {
  try {
    return Boolean(localStorage.getItem('cookie_consent'));
  } catch {
    return false;
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !hasConsent());

  const save = (accepted) => {
    try {
      localStorage.setItem('cookie_consent', JSON.stringify({ accepted, date: new Date().toISOString() }));
    } catch {
      // stockage indisponible : on masque quand même le bandeau pour cette session
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-6 sm:max-w-md z-50 animate-rise">
      <div className="glass holo rounded-3xl p-5 !bg-night/95">
        <div className="flex gap-4">
          <Fruit kind="cherry" glow className="w-12 h-12 shrink-0 animate-float" />
          <div className="flex-1">
            <p className="hud text-mango mb-1">Cookies</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Uniquement des cookies strictement nécessaires (session, panier). Aucun tracking, aucune pub.{' '}
              <Link to="/politique-cookies" className="text-mint hover:underline">
                En savoir plus
              </Link>
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => save(false)} className="btn-ghost flex-1 py-2.5 rounded-xl text-sm">
            Refuser
          </button>
          <button onClick={() => save(true)} className="btn-fruit flex-1 py-2.5 rounded-xl text-sm">
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
