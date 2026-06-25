export default function PolitiqueCookiesPage() {
  const handleReset = () => {
    localStorage.removeItem('cookie_consent');
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Politique de cookies</h1>
      <p className="text-sm text-gray-500 mb-8">
        Conformément aux recommandations de la CNIL et à la directive ePrivacy (2002/58/CE).
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Qu'est-ce qu'un cookie ?</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, mobile, tablette)
          lors de votre visite sur un site web. Il permet au site de mémoriser des informations sur votre
          visite pour améliorer votre expérience.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Cookies utilisés sur ce site</h2>

        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Cookies strictement nécessaires{' '}
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-normal ml-1">
              Toujours actifs
            </span>
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés.
          </p>
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-gray-700 font-medium">Nom</th>
                <th className="text-left px-4 py-2 text-gray-700 font-medium">Finalité</th>
                <th className="text-left px-4 py-2 text-gray-700 font-medium">Durée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-2 text-gray-600 font-mono text-xs">token</td>
                <td className="px-4 py-2 text-gray-600">Session d'authentification (JWT)</td>
                <td className="px-4 py-2 text-gray-600">24 heures</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-600 font-mono text-xs">user</td>
                <td className="px-4 py-2 text-gray-600">Informations de profil en session</td>
                <td className="px-4 py-2 text-gray-600">Session</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-600 font-mono text-xs">cart</td>
                <td className="px-4 py-2 text-gray-600">Contenu du panier</td>
                <td className="px-4 py-2 text-gray-600">Session</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-gray-600 font-mono text-xs">cookie_consent</td>
                <td className="px-4 py-2 text-gray-600">Mémorisation de votre choix de cookies</td>
                <td className="px-4 py-2 text-gray-600">6 mois</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Cookies analytiques et publicitaires
          </h3>
          <p className="text-sm text-gray-600">
            Ce site n'utilise actuellement aucun cookie analytique (statistiques de visite) ni publicitaire.
            Si cela devait changer, nous vous en informerons et recueillerons votre consentement préalable.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">3. Gestion de vos préférences</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Vous pouvez à tout moment retirer votre consentement ou modifier vos préférences en cliquant
          sur le bouton ci-dessous. Le bandeau de consentement réapparaîtra.
        </p>
        <button
          onClick={handleReset}
          className="border border-green-600 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50"
        >
          Gérer mes préférences de cookies
        </button>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Paramètres navigateur</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Vous pouvez également configurer votre navigateur pour bloquer ou supprimer les cookies.
          Attention : désactiver les cookies strictement nécessaires peut empêcher le bon fonctionnement
          du service (connexion, panier).
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
          <li>Chrome : Paramètres → Confidentialité → Cookies</li>
          <li>Firefox : Options → Vie privée et sécurité</li>
          <li>Safari : Préférences → Confidentialité</li>
          <li>Edge : Paramètres → Cookies et autorisations de site</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Contact</h2>
        <p className="text-gray-600 text-sm">
          Pour toute question : <strong>privacy@click-collect.fr</strong>
        </p>
      </section>

      <p className="text-xs text-gray-400 mt-8">Dernière mise à jour : juin 2026</p>
    </div>
  );
}
