export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Mentions légales</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Éditeur du site</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Le site <strong>FruityCollect</strong> est édité par la société <strong>[Nom de la société]</strong>,
          [Forme juridique] au capital de [X] €, immatriculée au Registre du Commerce et des Sociétés de [Ville]
          sous le numéro [SIRET].<br /><br />
          Siège social : [Adresse complète]<br />
          Numéro de TVA intracommunautaire : [FR XX XXX XXX XXX]<br />
          Email : contact@click-collect.fr<br />
          Téléphone : [+33 X XX XX XX XX]
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Directeur de la publication</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          [Prénom Nom], en qualité de [fonction].
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">3. Hébergeur</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Ce site est hébergé par :<br />
          <strong>[Nom de l'hébergeur]</strong><br />
          [Adresse de l'hébergeur]<br />
          [Site web de l'hébergeur]
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Propriété intellectuelle</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          L'ensemble des contenus présents sur ce site (textes, images, logos, icônes, structure) sont protégés
          par le droit de la propriété intellectuelle et sont la propriété exclusive de [Nom de la société],
          sauf mention contraire. Toute reproduction, représentation, modification ou exploitation non autorisée
          est strictement interdite.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">5. Données personnelles</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Le traitement de vos données personnelles est décrit dans notre{' '}
          <a href="/politique-confidentialite" className="text-green-600 hover:underline">
            Politique de confidentialité
          </a>.
          Conformément au RGPD, vous disposez de droits sur vos données que vous pouvez exercer depuis votre
          espace{' '}
          <a href="/account" className="text-green-600 hover:underline">Mon compte</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">6. Cookies</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          L'utilisation des cookies est décrite dans notre{' '}
          <a href="/politique-cookies" className="text-green-600 hover:underline">
            Politique de cookies
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">7. Limitation de responsabilité</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          [Nom de la société] s'efforce de maintenir les informations du site à jour et exactes. Toutefois,
          l'éditeur ne saurait être tenu responsable des erreurs ou omissions, ni des dommages directs ou
          indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder.
        </p>
      </section>

      <p className="text-xs text-gray-400 mt-8">Dernière mise à jour : juin 2026</p>
    </div>
  );
}
