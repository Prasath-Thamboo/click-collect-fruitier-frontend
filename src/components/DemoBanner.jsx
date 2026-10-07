import { useState } from 'react';
import { DEMO_MODE } from '../config/demo';

function isDismissed() {
  try {
    return sessionStorage.getItem('demo_banner_closed') === '1';
  } catch {
    return false;
  }
}

// Fin bandeau en haut du site rappelant que le projet est une démonstration
export default function DemoBanner() {
  const [closed, setClosed] = useState(isDismissed);

  if (!DEMO_MODE || closed) return null;

  const close = () => {
    try {
      sessionStorage.setItem('demo_banner_closed', '1');
    } catch {
      // stockage indisponible : on masque seulement pour cet affichage
    }
    setClosed(true);
  };

  return (
    <div className="relative z-50 border-b border-citrus/20 bg-citrus/[0.08] backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-3 text-center">
        <span className="neon-dot shrink-0" style={{ background: '#ffe14d', boxShadow: '0 0 10px #ffe14d' }} />
        <p className="text-xs sm:text-sm text-gray-700">
          <span className="font-semibold text-citrus">Site de démonstration</span> — les paiements et l'envoi
          d'emails ne sont pas encore actifs. Aucune commande réelle n'est passée.
        </p>
        <button
          onClick={close}
          aria-label="Masquer le message"
          className="shrink-0 w-6 h-6 rounded-lg grid place-items-center text-gray-500 hover:text-white hover:bg-white/10"
        >
          ×
        </button>
      </div>
    </div>
  );
}
