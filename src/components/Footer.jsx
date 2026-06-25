import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div>
            <p className="font-bold text-green-700 text-sm mb-1">FruityCollect</p>
            <p className="text-xs text-gray-400">Fruits frais en click & collect</p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
            <Link to="/mentions-legales" className="hover:text-green-700 hover:underline">
              Mentions légales
            </Link>
            <Link to="/cgv" className="hover:text-green-700 hover:underline">
              CGV
            </Link>
            <Link to="/politique-confidentialite" className="hover:text-green-700 hover:underline">
              Politique de confidentialité
            </Link>
            <Link to="/politique-cookies" className="hover:text-green-700 hover:underline">
              Politique de cookies
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} FruityCollect — Tous droits réservés
          </p>
          <p className="text-xs text-gray-400">
            Contact :{' '}
            <a href="mailto:contact@click-collect.fr" className="hover:text-green-700 hover:underline">
              contact@click-collect.fr
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
