import { COMPANY } from '../config/company';
import { Link } from 'react-router-dom';
import Logo from './ui/Logo';
import Fruit from './fruits/Fruit';
import { FRUIT_KINDS } from './fruits/fruitTheme';

const LEGAL = [
  { to: '/mentions-legales', label: 'Mentions légales' },
  { to: '/cgv', label: 'Conditions générales de vente' },
  { to: '/politique-confidentialite', label: 'Politique de confidentialité' },
  { to: '/politique-cookies', label: 'Politique de cookies' },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 px-3 sm:px-6 pb-6">
      {/* Bandeau de fruits */}
      <div className="max-w-6xl mx-auto flex justify-center gap-3 sm:gap-6 -mb-7 relative z-10">
        {FRUIT_KINDS.map((kind, i) => (
          <div key={kind} className={`animate-float ${i > 5 ? 'hidden sm:block' : ''}`} style={{ animationDelay: `${-i * 0.9}s` }}>
            <Fruit kind={kind} glow className="w-9 h-9 sm:w-12 sm:h-12" />
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto glass rounded-[2rem] overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mango to-transparent" />
        <div className="px-6 sm:px-10 pt-14 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr] gap-10 mb-10">
            <div>
              <Logo />
              <p className="text-sm text-gray-500 leading-relaxed mt-4 max-w-xs">
                Le verger du futur, en click &amp; collect. Des fruits frais, découpés et pressés,
                prêts quand vous l'êtes.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="chip hud text-gray-500"><span className="neon-dot" />Click &amp; Collect</span>
                <span className="chip hud text-gray-500">
                  <span className="neon-dot" style={{ background: '#ffab2e', boxShadow: '0 0 10px #ffab2e' }} />
                  Paiement sécurisé
                </span>
              </div>
            </div>

            <div>
              <p className="hud text-gray-400 mb-4">// Légal</p>
              <div className="flex flex-col gap-2.5">
                {LEGAL.map((l) => (
                  <Link key={l.to} to={l.to} className="text-sm text-gray-600 hover:text-white transition-colors w-fit group">
                    <span className="inline-block w-0 group-hover:w-3 transition-all text-mango overflow-hidden align-bottom">›</span>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="hud text-gray-400 mb-4">// Contact</p>
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-sm text-gray-600 hover:text-white transition-colors break-all"
              >
                {COMPANY.email}
              </a>
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="hud text-gray-400 mb-2">Paiement</p>
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="neon-dot" /> Sécurisé par Stripe
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} {COMPANY.name} — {COMPANY.address}
            </p>
            <p className="hud text-gray-400">v2.0 · Néon Verger</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
