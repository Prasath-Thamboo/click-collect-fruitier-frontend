import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <span>🍎</span> FruityCollect
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Fruits frais en click &amp; collect.<br />
              Commandez, on s'occupe du reste.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Légal</p>
            <div className="flex flex-col gap-2">
              <Link to="/mentions-legales" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                Mentions légales
              </Link>
              <Link to="/cgv" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                Conditions générales de vente
              </Link>
              <Link to="/politique-confidentialite" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/politique-cookies" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                Politique de cookies
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact</p>
            <a
              href="mailto:contact@click-collect.fr"
              className="text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              contact@click-collect.fr
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} FruityCollect — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
