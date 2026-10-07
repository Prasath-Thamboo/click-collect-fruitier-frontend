import { COMPANY } from '../config/company';

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">Mentions légales</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Éditeur du site</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Le site <strong>FruityCollect</strong> est édité par la société <strong>{COMPANY.name}</strong>,
          {COMPANY.legalForm} au capital de {COMPANY.capital} €, immatriculée au Registre du Commerce et des Sociétés de {COMPANY.rcsCity}
          sous le numéro {COMPANY.siret}.<br /><br />
          Siège social : {COMPANY.address}<br />
          Numéro de TVA intracommunautaire : {COMPANY.vat}<br />
          Email : {COMPANY.email}<br />
          Téléphone : {COMPANY.phone}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">2. Directeur de la publication</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {COMPANY.director.name}, en qualité de {COMPANY.director.role}.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">3. Hébergeur</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Ce site est hébergé par :<br />
          <strong>{COMPANY.host.name}</strong><br />
          {COMPANY.host.address}<br />
          {COMPANY.host.website}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">4. Propriété intellectuelle</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          L'ensemble des contenus présents sur ce site (textes, images, logos, icônes, structure) sont protégés
          par le droit de la propriété intellectuelle et sont la propriété exclusive de {COMPANY.name},
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
          {COMPANY.name} s'efforce de maintenir les informations du site à jour et exactes. Toutefois,
          l'éditeur ne saurait être tenu responsable des erreurs ou omissions, ni des dommages directs ou
          indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder.
        </p>
      </section>

      <p className="text-xs text-gray-400 mt-8">Dernière mise à jour : juin 2026</p>
    </div>
  );
}
